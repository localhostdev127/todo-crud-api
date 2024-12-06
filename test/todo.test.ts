import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app";

dotenv.config();

let testTodoId: string;
const timeout = 8000;

describe("Todo API", () => {
  beforeAll(() => {
    const mongoUri = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/todo_test_db";
    mongoose.connect(mongoUri)
    .then(()=>console.log("connected"))
    .catch(()=>console.log("mongoose connecttion error"));
  }, timeout);

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close(true);
  }, timeout);

  it("should create a new todo", async () => {
    const newTodo = { title: "Test Todo", description: "A test description" };
    const res = await request(app).post("/todos").send(newTodo);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(newTodo.title);
    testTodoId = res.body._id;
  }, timeout);

  it("should get a todo by ID", async () => {
    const res = await request(app).get(`/todos/${testTodoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", testTodoId);
    expect(res.body.title).toBe("Test Todo");
  }, timeout);

  it("should update a todo", async () => {
    const updatedTodo = { title: "Updated Todo", description: "Updated description", completed: true };
    const res = await request(app).put(`/todos/${testTodoId}`).send(updatedTodo);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedTodo.title);
    expect(res.body.description).toBe(updatedTodo.description);
    expect(res.body.completed).toBe(true);
  }, timeout);

  it("should delete a todo", async () => {
    const res = await request(app).delete(`/todos/${testTodoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Todo deleted successfully");

    const getRes = await request(app).get(`/todos/${testTodoId}`);
    expect(getRes.statusCode).toBe(404);
    expect(getRes.body).toHaveProperty("message", "Todo not found");
  }, timeout);

  it("should return 404 for a non-existent todo", async () => {
    const res = await request(app).get("/todos/64f9a7f8e4b0b72aa5c3e432");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Todo not found");
  }, timeout);
});
