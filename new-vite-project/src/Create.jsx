const Create = () => {

  const actionFn = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    e.target.reset();
    console.log(data);
    
    
  }
  return (
    <>
      <div className="container">
        <h1>Create Sport Talk Post</h1>

        <form onSubmit={actionFn}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter post title"
            required
          />

          <label>Content</label>
          <textarea
            name="content"
            placeholder="Write your post content here..."
            required
          ></textarea>

          <label>Image URL (optional)</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
          />

          <button type="submit">Create Post</button>
        </form>
      </div>
    </>
  );
};

export default Create;
