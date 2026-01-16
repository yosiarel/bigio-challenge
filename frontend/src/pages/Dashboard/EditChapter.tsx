import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import { chapterService } from '../../services/storyService';
import Swal from 'sweetalert2';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const EditChapter = () => {
  const navigate = useNavigate();
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!storyId || !chapterId) return;
      
      try {
        setLoading(true);
        const response = await chapterService.getById(storyId, chapterId);
        const chapter = response.data.data;
        
        setTitle(chapter.title);
        setContent(chapter.content || '');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load chapter'
        });
        navigate(`/stories/${storyId}/edit`);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [storyId, chapterId, navigate]);

  useEffect(() => {
    if (!editorRef.current || quillRef.current || loading) return;
    
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


    if (content) {
      quill.root.innerHTML = content;
    }

    quill.on('text-change', () => {
      setContent(quill.root.innerHTML);
    });
  }, [loading, content]);

  const handleUpdate = async () => {
    try {
      if (!title.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Title Required',
          text: 'Chapter title is required'
        });
        return;
      }
      if (!content.trim() || content === '<p><br></p>') {
        Swal.fire({
          icon: 'warning',
          title: 'Content Required',
          text: 'Chapter content is required'
        });
        return;
      }
      if (!storyId || !chapterId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Story ID or Chapter ID is missing. Please go back and try again.'
        });
        return;
      }

      const chapterData = {
        title: title.trim(),
        content: content,
      };

      await chapterService.update(storyId, chapterId, chapterData);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Chapter updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate(`/stories/${storyId}/edit`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update chapter';
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to update chapter: ${errorMessage}`
      });
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    if (storyId) {
      navigate(`/stories/${storyId}/edit`);
    } else {
      navigate('/stories');
    }
  };

  if (loading) {
    return (
      <>
        <PageMeta title="Edit Chapter" description="Edit chapter details" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-t-transparent"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Edit Chapter" description="Edit chapter details" />
      
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/stories" className="text-gray-500 hover:text-gray-700">
            Stories Management
          </Link>
          <span className="text-gray-400">&gt;</span>
          <Link to={`/stories/${storyId}/edit`} className="text-gray-500 hover:text-gray-700">
            Edit Story
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-cyan-500 font-medium">Edit Chapter</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Chapter</h1>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(`/stories/${storyId}/edit`)}
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
            onClick={handleUpdate}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Update
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cancel Editing
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

export default EditChapter;
