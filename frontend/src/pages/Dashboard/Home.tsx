import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Eye, Clock } from 'lucide-react';
import PageMeta from "../../components/common/PageMeta";
import { storyService, Story } from '../../services/storyService';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalChapters: 0
  });
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, storiesResponse] = await Promise.all([
          storyService.getDashboardStats(),
          storyService.getAll({ page: 1, limit: 5 })
        ]);
        
        setStats(statsResponse.data.data);
        setRecentStories(storiesResponse.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Dashboard | Story Management"
        description="Story Management Dashboard"
      />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome to Story Management System</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            title="Total Stories"
            value={stats.total}
            color="bg-blue-500"
          />
          <StatCard
            icon={Eye}
            title="Published"
            value={stats.published}
            color="bg-green-500"
          />
          <StatCard
            icon={FileText}
            title="Draft"
            value={stats.draft}
            color="bg-yellow-500"
          />
          <StatCard
            icon={Clock}
            title="Total Chapters"
            value={stats.totalChapters}
            color="bg-orange-500"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Stories</h2>
              <button
                onClick={() => navigate('/stories')}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                View All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Chapters
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {recentStories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No stories yet. Create your first story!
                    </td>
                  </tr>
                ) : (
                  recentStories.map((story) => (
                    <tr
                      key={story.id}
                      onClick={() => navigate(`/stories/${story.id}`)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-950"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {story.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {story.author}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {story.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          story.status === 'PUBLISH'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {story.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {story._count?.chapters || story.chapters?.length || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
