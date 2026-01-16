import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import { storyService } from '../../services/storyService';
import { uploadService } from '../../services/uploadService';
import Swal from 'sweetalert2';

interface Tag {
  id: string;
  text: string;
}

interface Chapter {
  id: string;
  title: string;
  lastUpdated: string;
}

const AddStory = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [writerName, setWriterName] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [status, setStatus] = useState('PUBLISH');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag: Tag = {
        id: Date.now().toString(),
        text: tagInput.trim()
      };
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate('/stories');
  };

  const handleSave = async () => {
    try {
      if (!title.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Title Required',
          text: 'Title is required'
        });
        return;
      }
      if (!writerName.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Writer Name Required',
          text: 'Writer name is required'
        });
        return;
      }
      if (!synopsis.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Synopsis Required',
          text: 'Synopsis is required'
        });
        return;
      }
      if (!category) {
        Swal.fire({
          icon: 'warning',
          title: 'Category Required',
          text: 'Category is required'
        });
        return;
      }
      if (tags.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Tags Required',
          text: 'Please add at least one tag'
        });
        return;
      }

      setUploading(true);

      const storyData: any = {
        title: title.trim(),
        author: writerName.trim(),
        synopsis: synopsis.trim(),
        category: category as 'FINANCIAL' | 'TECHNOLOGY' | 'HEALTH',
        tags: tags.map(t => t.text),
        status: status as 'DRAFT' | 'PUBLISH',
      };

      if (coverImage) {
        try {
          const uploadResult = await uploadService.uploadCover(coverImage);
          storyData.coverUrl = uploadResult.url;
        } catch (uploadError) {
          setUploading(false);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Failed to upload cover image. Please try again.'
          });
          return;
        }
      }

      await storyService.create(storyData);
      setUploading(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Story saved successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/stories');
    } catch (error: any) {
      setUploading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save story';
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to save story: ${errorMessage}`
      });
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
  };

  return (
    <>
      <PageMeta title="Add Story" description="Create a new story with chapters" />
      
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link 
            to="/stories" 
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Stories Management
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-cyan-500 font-medium">Add Stories</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Add Stories
        </h1>
        
        <button
          onClick={() => navigate('/stories')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="p-6 space-y-6">
          {/* Title and Writer Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Writer Name
              </label>
              <input
                type="text"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                placeholder="Writer Name"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Synopsis
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Synopsis"
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Category</option>
                <option value="FINANCIAL">Financial</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="HEALTH">Health</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags/Keywords Story
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type and press Enter"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-white bg-orange-500 rounded-full"
                      >
                        {tag.text}
                        <button
                          onClick={() => removeTag(tag.id)}
                          className="hover:bg-orange-600 rounded-full p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover Image and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 15L16 10L5 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </label>
                {coverImage && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {coverImage.name}
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="PUBLISH">Publish</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          {/* Chapter List Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chapter List
              </h2>
              <div className="relative group">
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg cursor-not-allowed"
                >
                  + New Chapter
                </button>
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg z-10">
                  Save the story first before adding chapters
                </div>
              </div>
            </div>

            {/* Chapter Table */}
            {chapters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Chapter Title
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Updated
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.map((chapter) => (
                      <tr
                        key={chapter.id}
                        className="border-b border-gray-200 dark:border-gray-800 last:border-0"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {chapter.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {chapter.lastUpdated}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDeleteChapter(chapter.id)}
                              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No chapters added yet. Click "New Chapter" to add one.
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Confirm Cancel
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to cancel adding the story without saving the data?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  No
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddStory;
