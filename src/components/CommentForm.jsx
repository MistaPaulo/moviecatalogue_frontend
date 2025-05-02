import React, { useState } from 'react';
import commentService from '../services/comment.service';

const CommentForm = ({ movieId, onCommentAdded }) => {
  const [text, setText] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const comment = await commentService.postComment(movieId, text);
      onCommentAdded(comment);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        rows="3"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Escreve o teu comentário..."
        className="form-control mb-2"
      />
      <button type="submit" className="btn btn-primary">Enviar comentário</button>
    </form>
  );
};

export default CommentForm;
