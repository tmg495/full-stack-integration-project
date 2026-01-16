/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment"; // Import moment.js for date formatting
import styles from "./CommentSection.module.css";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]); // State to store fetched comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [editComment, setEditComment] = useState(null); // State for the comment being edited
  const [hideComment, setHideComment] = useState(false); // Toggle visibility of comments
  const [sortOption, setSortOption] = useState("newest"); // Sorting option for comments
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // useEffect hook to fetch and display comments for a specific post.  The dependency array [postId] ensures this runs whenever the postId changes  This hook is used to perform side effects in functional components, such as fetching data, subscribing to events, or manually changing the DOM.
  useEffect(() => {
    // Define an asynchronous function to fetch comments from the API.  Asynchronous functions allow you to work with promises and await their resolution.  This makes asynchronous code easier to read and reason about.
    const fetchComments = async () => {
      try {
        const userInfo = localStorage.getItem("auth_user")
        const { token, currentUserId } = JSON.parse(userInfo)
        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/comments/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include token in Authorization header
            },
          }
        );

        const parsedResponse = await response.json()

        setComments(parsedResponse);
      } catch (error) {
        console.error(error)
      }
    };

    // Call the fetchComments function to initiate the comment fetching process.
    fetchComments();
    // Specify the postId as a dependency for the useEffect hook. This ensures that the effect runs whenever the postId changes.  If the postId changes, the component needs to fetch the comments for the new post
  }, [postId]);

  // Function to handle adding a new comment
  const handleAddComment = async (e) => {
    try {
      e.preventDefault()
      const userInfo = localStorage.getItem("auth_user")
      
      const { token, id: currentUserId } = JSON.parse(userInfo)
      
      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/comments/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          body: JSON.stringify({
            content: newComment,
            author: currentUserId
          })
        }
      );

      const parsedResponse = await response.json()
      setComments([...comments, parsedResponse]);

      setNewComment('')
    } catch (error) {
      console.error(error)
    }
  };

  // Function to handle editing an existing comment
  const handleEditComment = (comment) => {
    // Set the comment to be edited in the state.  This will trigger the edit mode in the component
    setEditComment(comment);
    // Populate the input field with the content of the comment to be edited.
    setNewComment(comment.content);
  };

  // Function to handle updating an existing comment
  const handleUpdateComment = async (e) => {
    try {
      e.preventDefault()
      const userInfo = localStorage.getItem("auth_user")
      const { token, id: currentUserId } = JSON.parse(userInfo)

      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }
      
      if (currentUserId != editComment.author) {
        alert("Can't edit comments by other users.");
        return;
      }
      
      const commentId = editComment._id

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          body: JSON.stringify({
            content: newComment,
            author: currentUserId
          })
        }
      );
      const parsedResponse = await response.json()
      const newCommentArray = comments.map((c) => {
        if (c._id == commentId) {
          return parsedResponse
        } else {
          return c
        }
      })

      setComments(newCommentArray)
      setEditComment(null)
      setNewComment("")

    } catch (error) {
      console.error(error)
    }
  };

  // Function to handle deleting a comment
  const handleDeleteComment = async (commentId, commentAuthorId) => {
    try {
      const userInfo = localStorage.getItem("auth_user")
      const { token, id: currentUserId } = JSON.parse(userInfo)

      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }
      if (currentUserId != commentAuthorId) {
        alert("Can't delete comments by other users.");
        return;
      }
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          }
        }
      );
      const newCommentArray = comments.filter((c) => c._id != commentId)
      setComments(newCommentArray)

    } catch (error) {
      console.error(error)
    }

  };

  // Function to toggle the visibility of the comments section
  const toggleShowComments = () => {
    //sets the hideComment state to the opposite of its current value. This is a common way to toggle a boolean value.
    setHideComment(!hideComment);
  };

  // Function to render the comments section. This function takes the comments data from the component's state, sorts them according to the selected sort option, and then maps each comment to a JSX element for display.
  const renderComments = () => {
    // Create a copy of the comments array using the spread operator to avoid modifying the original state directly.  This is because sort mutates the original array
    const sortedComments = [...comments].sort((a, b) => {
      // Sort comments by creation date (newest or oldest)
      if (sortOption === "newest") {
        // Compare the createdAt timestamps of two comments (b - a for descending order - newest first) and converts them to date objects before comparison
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "oldest") {
        //Compare timestamps in ascending order to sort from oldest to newest
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0; // Don't sort if sortOption is not "newest" or "oldest"
    });

    return sortedComments.map(
      (
        comment // Map over the sorted comments array and render each comment
      ) => (
        <div key={comment._id} className={styles.comment}>
          {" "}
          {/* Container for each comment  */}
          <p>{comment.content}</p> {/* Display the comment content */}
          {/* Display the timestamp of when the comment was created in a specific format */}
          <span className={styles.comment__timestamp}>
            {moment(comment.createdAt).format("Do MMM YYYY HH:mm:ss")}
          </span>
          {/* Button to edit the comment */}
          <button onClick={() => handleEditComment(comment)}>Edit</button>
          {/* Button to delete the comment */}
          <button
            onClick={() => handleDeleteComment(comment._id, comment.author)} // Pass comment ID and author ID for authorization
          >
            Delete
          </button>
        </div>
      )
    );
  };


  // Return the JSX to render the comment section component
  return (
    <div className={styles.commentSection}>
      {" "}
      {/* Main container for the comment section */}
      <h3>
        {" "}
        {/* Heading that changes based on whether the user is editing a comment or adding a new one */}
        {editComment ? "Edit your comment" : "Leave a comment"}
      </h3>
      {/* Form for adding or updating a comment */}
      <form onSubmit={editComment ? handleUpdateComment : handleAddComment}>
        {" "}
        {/* Determine which function to call on submit based on editComment state */}
        <div className={styles.textareaContainer}>
          {" "}
          {/* Container for the textarea */}
          <textarea
            value={newComment} // Bind the value to the newComment state
            onChange={(e) => setNewComment(e.target.value)} // Update newComment state when input changes
            placeholder={
              // Dynamic placeholder text
              editComment ? "Update your comment..." : "Write a comment..."
            }
            className={styles.commentForm__input}
            rows="3" //Set the number of rows for the textarea
            disabled={loading} //Disable textarea while loading
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || loading} // Disable if comment is empty or loading
          className={styles.commentForm__submit}
        >
          {/* Dynamic button text based on loading and edit state */}
          {loading
            ? "Processing..." // Display loading text while submitting
            : editComment
            ? "Update Comment"
            : "Comment"}
        </button>
        {/* Cancel button for editing a comment */}
        {editComment && ( // Conditionally render the Cancel button only in edit mode
          <button
            type="button" //important to set to button so that the form isn't submitted
            onClick={() => {
              // Clear edit state and reset input field when clicked
              setEditComment(null);
              setNewComment("");
            }}
            className={styles.cancelEditBtn}
          >
            Cancel
          </button>
        )}
      </form>
      <div className={styles.sortOptions}>
        {" "}
        {/*Container for comment sorting options*/}
        <label>Sort by: </label> {/*Label for the select dropdown*/}
        <select
          value={sortOption} // Bind selected value to sortOption state
          onChange={(e) => setSortOption(e.target.value)} // Update sortOption on change
        >
          <option value="newest">Newest</option>{" "}
          {/* Option to sort by newest comments */}
          <option value="oldest">Oldest</option>{" "}
          {/* Option to sort by oldest comments */}
        </select>
      </div>
      {/* Button to show/hide comments */}
      <button onClick={toggleShowComments} className={styles.toggleCommentsBtn}>
        {" "}
        {/* Button to toggle comment visibility */}
        {hideComment ? "Show comments" : "Hide comments"}{" "}
        {/* Toggle button text */}
      </button>
      {/* Conditionally render the comments list */}
      {!hideComment && ( // Only render comments if hideComment is false
        <div className={styles.commentsList}>{renderComments()}</div> // Render the comments using the renderComments function
      )}
    </div>
  );
}

// PropTypes for type checking the component's props
CommentSection.propTypes = {
  postId: PropTypes.number.isRequired, // postId is required and must be a number
};

// Export the CommentSection component as the default export
export default CommentSection;
