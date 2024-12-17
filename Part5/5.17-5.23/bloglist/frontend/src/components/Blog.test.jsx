import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("Blog component", () => {
  let blog;
  let mockHandleLike;
  let mockHandleDelete;

  beforeEach(() => {
    blog = {
      title: "React testing made easy",
      author: "Dan Abramov",
      url: "https://reacttesting.com",
      likes: 5,
    };

    mockHandleLike = jest.fn();
    mockHandleDelete = jest.fn();
  });

  test("renders title and author, but does not render URL or likes by default", () => {
    const { container } = render(
      <Blog blog={blog} handleLike={mockHandleLike} handleDelete={mockHandleDelete} />
    );

    const titleAuthorElement = container.querySelector(".blog-title-author");
    expect(titleAuthorElement).toHaveTextContent("React testing made easy Dan Abramov");

    const urlElement = screen.queryByText("https://reacttesting.com");
    const likesElement = screen.queryByText("likes 5");

    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();
  });

  test("renders URL and likes when the 'view' button is clicked", () => {
    const { container } = render(
      <Blog blog={blog} handleLike={mockHandleLike} handleDelete={mockHandleDelete} />
    );

    const button = screen.getByText("view");
    fireEvent.click(button);

    const urlElement = screen.getByText("https://reacttesting.com");
    const likesElement = screen.getByText("likes 5");

    expect(urlElement).toBeDefined();
    expect(likesElement).toBeDefined();
  });

  test("clicking the like button twice calls the event handler twice", () => {
    render(<Blog blog={blog} handleLike={mockHandleLike} handleDelete={mockHandleDelete} />);

    const viewButton = screen.getByText("view");
    fireEvent.click(viewButton);

    const likeButton = screen.getByText("like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandleLike.mock.calls).toHaveLength(2);
  });
});
