import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, MoreHorizontal } from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import { storyService } from '../../services/storyService';
import { uploadService } from '../../services/uploadService';
import Swal from 'sweetalert2';
import { useClickOutside } from '../../hooks/useClickOutside';

interface Tag {
  id: string;
  text: string;
}

interface Chapter {
  id: string;
  title: string;
  lastUpdated: string;
}

const EditStory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [writerName, setWriterName] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [status, setStatus] = useState('PUBLISH');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef as any, () => setOpenDropdownId(null));

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await storyService.getById(id);
        const story = response.data.data;
        
        setTitle(story.title);
        setWriterName(story.author);
        setSynopsis(story.synopsis);
        setCategory(story.category);
        setTags(story.tags.map((tag: string, index: number) => ({ id: `${index}`, text: tag })));
        setStatus(story.status);
        setChapters(story.chapters?.map((ch: any) => ({
          id: ch.id,
          title: ch.title,
          lastUpdated: new Date(ch.updatedAt).toLocaleDateString()
        })) || []);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load story'
        });
        navigate('/stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, navigate]);

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

  const handleUpdate = async () => {
    if (!id) return;

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

      await storyService.update(id, storyData);
      setUploading(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Story updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/stories');
    } catch (error: any) {
      setUploading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update story';
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to update story: ${errorMessage}`
      });
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate('/stories');
  };

  const handleDelete = async () => {
    if (!id) return;

    const result = await Swal.fire({
      title: 'Delete Story?',
      text: 'Are you sure you want to delete this story? This action cannot be undone and will delete all chapters.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await storyService.delete(id);
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Story has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/stories');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete story';
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Failed to delete story: ${errorMessage}`
        });
      }
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
    setOpenDropdownId(null);
  };

  const toggleDropdown = (chapterId: string) => {
    setOpenDropdownId(openDropdownId === chapterId ? null : chapterId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Edit Story" description="Edit story details" />
      
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/stories" className="text-gray-500 hover:text-gray-700">
            Stories Management
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-cyan-500 font-medium">Edit Story</span>
        </nav>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Story</h1>
      </div>

      <button
        onClick={() => navigate('/stories')}
        className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            General Information
          </h2>

          <div className="mb-4">
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

          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Synopsis
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Synopsis"
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Select Category</option>
              <option value="FINANCIAL">Financial</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="HEALTH">Health</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags/Keywords
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg dark:border-gray-700">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm dark:bg-orange-900 dark:text-orange-300"
                >
                  {tag.text}
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter"
                className="flex-1 min-w-[150px] px-2 py-1 text-sm border-0 focus:outline-none dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
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

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chapter List
              </h2>
              <button
                onClick={() => navigate(`/stories/${id}/add-chapter`)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                + New Chapter
              </button>
            </div>

            {chapters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Last Updated
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.map((chapter) => (
                      <tr key={chapter.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {chapter.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {chapter.lastUpdated}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center relative">
                            <button
                              onClick={() => toggleDropdown(chapter.id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              aria-label="Chapter actions"
                            >
                              <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            
                            {openDropdownId === chapter.id && (
                              <div 
                                ref={dropdownRef}
                                className="absolute right-0 top-full mt-1 z-10 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                              >
                                <button
                                  onClick={() => {
                                    navigate(`/stories/${id}/chapters/${chapter.id}/edit`);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(chapter.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                No chapters added yet. Click "New Chapter" to add one.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Delete Story
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={uploading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Update'}
            </button>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/30 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Cancel
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to cancel editing the story without saving the changes?
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

export default EditStory;
