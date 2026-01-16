import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import { chapterService } from '../../services/storyService';
import Swal from 'sweetalert2';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const AddChapter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storyId } = useParams<{ storyId: string }>();
  const storyIdFromState = location.state?.storyId || storyId;
  
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!editorRef.current || isInitialized.current) return;
    
    isInitialized.current = true;
    
    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'Write your chapter content here...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'align': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image', 'code-block'],
          ['clean']
        ],
      },
    });

    quillRef.current = quill;

    quill.on('text-change', () => {
      setStory(quill.root.innerHTML);
    });
  }, []);

  const handleSave = async () => {
    try {
      if (!title.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Title Required',
          text: 'Chapter title is required'
        });
        return;
      }
      if (!story.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Content Required',
          text: 'Chapter content is required'
        });
        return;
      }
      if (!storyIdFromState) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Story ID is missing. Please go back and try again.'
        });
        return;
      }

      const chapterData = {
        title: title.trim(),
        content: story,
      };

      await chapterService.create(storyIdFromState, chapterData);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Chapter saved successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate(`/stories/${storyIdFromState}/edit`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save chapter';
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to save chapter: ${errorMessage}`
      });
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    if (storyIdFromState) {
      navigate(`/stories/${storyIdFromState}/edit`);
    } else {
      navigate('/stories');
    }
  };

  return (
    <>
      <PageMeta title="Add Chapter" description="Create a new chapter for the story" />
      
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/stories" className="text-gray-500 hover:text-gray-700">
            Stories Management
          </Link>
          <span className="text-gray-400">&gt;</span>
          <Link to="/stories/add" className="text-gray-500 hover:text-gray-700">
            Add Stories
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-cyan-500 font-medium">Add Chapter</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Chapter</h1>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/stories/add')}
        className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Title Field */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Story Editor Field */}
        <div className="mb-6">
          <label htmlFor="story" className="block text-sm font-semibold text-gray-900 mb-2">
            Story
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div ref={editorRef} className="min-h-[400px]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cancel Chapter
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel? All unsaved changes will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No, Continue Editing
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddChapter;
