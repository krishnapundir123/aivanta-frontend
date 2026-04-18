import { useState } from 'react';
import {
  FileText,
  Search,
  Tag,
  Eye,
  ThumbsUp,
  Clock,
  Plus,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDummyData } from '../../../shared/mocks/useDummyData';
import Badge from '../../../shared/components/ui/Badge';
import Button from '../../../shared/components/ui/Button';

export default function DocumentsPage() {
  const dummy = useDummyData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const documents = dummy.enabled ? dummy.documents : [];

  const categories = Array.from(new Set(documents.map((d) => d.category)));

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !categoryFilter || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500">Documents, guides, and best practices</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>New Document</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No documents found</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <Badge variant="info" size="sm">
                  {doc.category}
                </Badge>
              </div>

              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {doc.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                {doc.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {doc.views}
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {doc.helpful}
                  </span>
                </div>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(new Date(doc.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                By {doc.author.name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
