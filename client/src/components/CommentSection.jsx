import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "../components/Comment.jsx";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import toast from "react-hot-toast";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  //for putting the test
  const [comment, setComment] = useState("");
  //all coment fetching
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    // console.log(comment)
    //console.log("comment")
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      console.log(res);
      const data = await res.json();
      console.log(res.ok);
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const getPostComments = await fetch(
          `/api/comment/getPostComments/${postId}`
        );

        if (getPostComments.ok) {
          const data = await getPostComments.json();
          setComments(data);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    console.log("called");
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();

        setComments(
          comments.map((comment) => {
            return comment._id === commentId
              ? {
                  ...comment,
                  numberOfLikes: data.numberOfLikes,
                  likes: data.likes,
                }
              : comment;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map((c) => {
        return c._id === comment._id ? { ...c, content: editedComment } : c;
      })
    );
  };

  const handleDelete = async () => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();

        setComments(
          comments.filter((comment) => comment._id !== commentToDelete)
        );

        toast.success("Comment deleted successfully");
      }
    } catch {
      toast.error(error);
    }
    setShowModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <>
          <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p className="pr-1">Signed in as:</p>
            <img
              src={currentUser.profilePicture}
              className="rounded-full h-5 w-5 object-cover "
            ></img>
            <Link
              to={"/dashboard?tab=profile"}
              className="text-xs text-cyan-600 hover:underline font-semibold"
            >
              @{currentUser.username}
            </Link>
          </div>
          <div></div>
        </>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          />

          <div className="flex  text-xs text-gray-500 justify-between mt-3 items-center">
            <p>{200 - comment.length} characters remaining</p>
            <Button gradientDuoTone="purpleToBlue" outline type="submit">
              {" "}
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm mt-5">No comments yet!</p>
      ) : (
        <>
          <div className="flex flex-row gap-2 mt-4 text-sm">
            <p>Comments</p>
            <span className="border-2 border-gray-400  px-1">
              {comments.length}
            </span>
          </div>
          <div>
            {comments.map((commentElement) => (
              <Comment
                key={comment._id}
                comment={commentElement}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={(commentId) => {
                  setShowModal(true);
                  setCommentToDelete(commentId);
                }}
              />
            ))}
          </div>
        </>
      )}

      <Modal
        dismissible
        popup
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center font-semibold">
            <BsFillExclamationOctagonFill className="text-red-600 mx-auto text-6xl mb-5" />
            <h3 className="text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the comment?
            </h3>
          </div>
          <div className="flex justify-center gap-5 mt-6">
            <Button color="failure" onClick={handleDelete}>
              Yes,I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No,cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {commentError && <Alert color="failure">{commentError} </Alert>}
    </div>
  );
};

export default CommentSection;
