import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, X } from 'lucide-react';
import PageMeta from "../../components/common/PageMeta";
import Loading from "../../components/common/Loading";
import { useStories } from "../../hooks/useStories";
import { useDebounce } from "../../hooks/useDebounce";
import { STORY_CATEGORIES, STORY_STATUS, PAGINATION } from "../../constants";

const StoryList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION.DEFAULT_PAGE);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [tempFilterCategory, setTempFilterCategory] = useState("");
  const [tempFilterStatus, setTempFilterStatus] = useState("");

  const { stories, loading, totalPages, totalStories, fetchStories } = useStories();

  useEffect(() => {
    fetchStories({
      search: debouncedSearch,
      page: currentPage,
      limit: PAGINATION.DEFAULT_LIMIT,
      category: filterCategory || undefined,
      status: filterStatus || undefined,
    });
  }, [currentPage, debouncedSearch, filterCategory, filterStatus]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(PAGINATION.DEFAULT_PAGE);
  };

  const handleOpenFilter = () => {
    setTempFilterCategory(filterCategory);
    setTempFilterStatus(filterStatus);
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setFilterCategory(tempFilterCategory);
    setFilterStatus(tempFilterStatus);
    setCurrentPage(PAGINATION.DEFAULT_PAGE);
    setShowFilterModal(false);
  };

  const handleResetFilter = () => {
    setTempFilterCategory("");
    setTempFilterStatus("");
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "PUBLISH"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const startIndex = (currentPage - 1) * PAGINATION.DEFAULT_LIMIT + 1;
  const endIndex = Math.min(currentPage * PAGINATION.DEFAULT_LIMIT, totalStories);

  return (
    <>
      <PageMeta
        title="Story Management | STORYKU"
        description="Manage your stories"
      />
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
          Stories
        </h1>

        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by Writers / Title"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-12 pr-4 text-sm text-black placeholder:text-gray-400 focus:border-orange-500 focus:outline-none dark:border-strokedark dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenFilter}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white text-black hover:bg-gray-50 dark:border-strokedark dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 5.83333H17.5M5.83333 9.16667H14.1667M8.33333 12.5H11.6667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
            <button 
              onClick={() => navigate('/stories/add')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 5V15M5 10H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Add Story
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left dark:bg-gray-800">
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  No
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Title
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Writers
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Category
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Keyword
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white text-center">
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8">
                    <Loading />
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No stories found
                  </td>
                </tr>
              ) : (
                stories.map((story, index) => (
                  <tr
                    key={story.id}
                    className="border-b border-stroke dark:border-strokedark"
                  >
                    <td className="px-4 py-4">
                      {startIndex + index}
                    </td>
                    <td className="px-4 py-4 text-black dark:text-white">
                      {story.title}
                    </td>
                    <td className="px-4 py-4">{story.author}</td>
                    <td className="px-4 py-4">{story.category}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {story.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                          story.status
                        )}`}
                      >
                        {story.status === "PUBLISH" ? "Publish" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === story.id ? null : story.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        {activeDropdown === story.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setActiveDropdown(null);
                                  navigate(`/stories/${story.id}`);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Story Detail
                              </button>
                              <button
                                onClick={() => {
                                  setActiveDropdown(null);
                                  navigate(`/stories/${story.id}/edit`);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Edit Story
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {totalStories > 0 ? startIndex : 0} - {endIndex} dari{" "}
            {totalStories} data
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-400 text-white hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-900/20 dark:text-orange-400"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-sm font-medium text-white">
              {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-400 text-white hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-900/20 dark:text-orange-400"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Filter
              </h2>
              <button
                onClick={handleCancelFilter}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Category
              </label>
              <select
                value={tempFilterCategory}
                onChange={(e) => setTempFilterCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Categories</option>
                {Object.values(STORY_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <select
                value={tempFilterStatus}
                onChange={(e) => setTempFilterStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Status</option>
                {Object.values(STORY_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleResetFilter}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Reset
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelFilter}
                  className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilter}
                  className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryList;
