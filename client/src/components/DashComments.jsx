import { Alert, Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import noUser from "../assets/noUser.jpg";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import toast from "react-hot-toast";



const DashComments = () => {

  
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const [showError, setShowError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = comments.length;
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startIndex}`
      );

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async () => {
    console.log("here");
    setShowModal(false);
    try {
      // console.log(commentIdToDelete)
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        // console.log(data)
        setShowError(data.message);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowSuccess(data);
      }
    } catch (error) {
      // console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    let timeoutId;

    if (showSuccess) {
      timeoutId = setTimeout(() => {
        setShowSuccess(null);
      }, 6000);
    } else if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(null);
      }, 6000);
    }

    // Clean up the timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess, showError]);

  return (
    <div className="w-full h-full ">
      {currentUser.isAdmin && comments.length > 0 ? (
        <div
          className="min-h-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 "
        >
          <Table hoverable className="shadow-md m-6" striped>
            <Table.Head>
              <Table.HeadCell>Date Updated At</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Number Of Likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row
                  className="bg-white  dark:border-gray-700 dark:bg-gray-800"
                  key={comment._id}
                >
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>

                  <Table.Cell>
                    <span
                      className="text-red-600 hover:underline font-semibold cursor-pointer"
                      onClick={() => {
                        setShowModal(true);

                        setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}{" "}
            </Table.Body>
          </Table>

          {showMore && (
            <button
              className="text-teal-400 hover:text-teal-600 self-center w-full font-semibold p-4"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
          {showSuccess && <Alert color="success">{showSuccess}</Alert>}
          {showError && <Alert color="failure">{showError}</Alert>}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center my-20 flex-1 ">
          <img src={noUser} className="w-[25%] h-[25%]"></img>
          <h1 className="font-semibold text-2xl">
            You have no comment yet...{" "}
          </h1>
        </div>
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
              Are you sure you want to delete the Comment?
            </h3>
          </div>
          <div className="flex justify-center gap-5 mt-6">
            <Button color="failure" onClick={handleDeleteComment}>
              Yes,I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No,cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComments;
