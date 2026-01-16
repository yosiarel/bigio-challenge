import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, X } from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import { storyService, chapterService } from '../../services/storyService';
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

const StoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [writerName, setWriterName] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [status, setStatus] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{ title: string; content: string } | null>(null);
  const [loadingChapter, setLoadingChapter] = useState(false);

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
        setCoverImage(story.coverUrl || '');
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

  const handleViewChapter = async (chapterId: string) => {
    if (!id) return;
    
    try {
      setLoadingChapter(true);
      setShowChapterModal(true);
      const response = await chapterService.getById(id, chapterId);
      const chapter = response.data.data;
      setSelectedChapter({
        title: chapter.title,
        content: chapter.content
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load chapter details'
      });
      setShowChapterModal(false);
    } finally {
      setLoadingChapter(false);
    }
  };

  const closeChapterModal = () => {
    setShowChapterModal(false);
    setSelectedChapter(null);
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
      <PageMeta title="Story Detail" description="View story details" />
      
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/stories" className="text-gray-500 hover:text-gray-700">
            Stories Management
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-cyan-500 font-medium">Story Detail</span>
        </nav>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Story Detail</h1>
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
              disabled
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Writer Name
            </label>
            <input
              type="text"
              value={writerName}
              disabled
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Synopsis
            </label>
            <textarea
              value={synopsis}
              disabled
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              disabled
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags/Keywords
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image
              </label>
              <input
                type="text"
                value={coverImage || 'No image'}
                disabled
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <input
                type="text"
                value={status === 'PUBLISH' ? 'Publish' : 'Draft'}
                disabled
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chapter List
              </h2>
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
                          <button
                            onClick={() => handleViewChapter(chapter.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                No chapters available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Detail Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {loadingChapter ? 'Loading...' : selectedChapter?.title}
              </h3>
              <button
                onClick={closeChapterModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {loadingChapter ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-t-transparent"></div>
                </div>
              ) : (
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: selectedChapter?.content || '' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryDetail;
