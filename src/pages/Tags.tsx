import React, { useState, useEffect } from 'react';
import { Tag } from '../types';
import { apiService } from '../services/api';
import { Plus, Edit, Trash2, Tag as TagIcon, Loader } from 'lucide-react';

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching tags with question counts...');
      
      // Use our new method that gets question counts for each tag
      const data = await apiService.getTagsWithQuestionCounts();
      console.log('Tags with question counts:', data);
      
      // Log individual tag details
      data.forEach((tag, index) => {
        console.log(`Tag ${index + 1}: ${tag.name} - ${tag.questions?.length || 0} questions`);
      });
      
      setTags(data);
    } catch (err) {
      setError('Failed to load tags');
      console.error('Error loading tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      const newTag = await apiService.createTag({ name: newTagName.trim() });
      setTags([...tags, newTag]);
      setNewTagName('');
    } catch (err) {
      setError('Failed to create tag');
      console.error('Error creating tag:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag || !editTagName.trim()) return;

    try {
      const updatedTag = await apiService.updateTag(editingTag.id, { name: editTagName.trim() });
      setTags(tags.map(tag => tag.id === editingTag.id ? updatedTag : tag));
      setEditingTag(null);
      setEditTagName('');
    } catch (err) {
      setError('Failed to update tag');
      console.error('Error updating tag:', err);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tag? This will remove it from all questions.')) {
      return;
    }

    try {
      await apiService.deleteTag(id);
      setTags(tags.filter(tag => tag.id !== id));
    } catch (err) {
      setError('Failed to delete tag');
      console.error('Error deleting tag:', err);
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
  };

  const cancelEditing = () => {
    setEditingTag(null);
    setEditTagName('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
        <span className="text-sm text-gray-500">
          {tags.length} tag{tags.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={loadTags}
            className="mt-2 btn-primary"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Create New Tag */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Tag</h2>
        <form onSubmit={handleCreateTag} className="flex gap-3">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name..."
            className="input-field flex-1"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating || !newTagName.trim()}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create Tag'}
          </button>
        </form>
      </div>

      {/* Tags List */}
      {tags.length === 0 ? (
        <div className="text-center py-12">
          <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            No tags found. Create your first tag to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tags.map((tag) => (
            <div key={tag.id} className="card">
              {editingTag?.id === tag.id ? (
                // Edit Mode
                <form onSubmit={handleEditTag} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    className="input-field flex-1"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!editTagName.trim()}
                    className="btn-primary"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {tag.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tag.questions?.length || 0} question{(tag.questions?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(tag)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit tag"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete tag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tags; 