import React, { useState, useEffect } from 'react'
import { getComments, addComment } from '../../services/api' 

const CommentSection = ({ activityId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getComments(activityId) call
        setComments(fetchedComments)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [activityId])

  const handleAddComment = async (e) => {
    e.preventDefault()
    try {
      await addComment(activityId, { text: newComment }) 
      setComments([...comments, { text: newComment }])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  if (loading) return <p>Loading comments...</p>

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <p key={index}>{comment.text}</p>
      ))}
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  )
}

export default CommentSection
