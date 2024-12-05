import { use, expect } from "chai";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);
import app from "../server.js";

const request = chai.request.execute;
chai.expect();

describe("register check", () => {
  it("should return success msg for successful registration", async () => {
    const newUser = {
      name: "yogeshw",
      email: "yogeshssgs@gmail.com",
      password: "yogi",
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property("msg", "User created successfully");
      });
  });

  it("should return failure msg for unsuccessful registration", async () => {
    const newUser = {
      username: "yogi",
      password: "yogi",
    };

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.status).to.be.equal(400);
    expect(res.body).to.have.property("msg", "missing fields");
  });
});

describe("login check", () => {
  it("should return status as success for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "admin",
        password: "admin",
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property("status", "success");
      });
  });

  it("should return status as failure for invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "adminn",
      password: "admin",
    });

    expect(res.status).to.be.equal(401);
    expect(res.body).to.have.property("status", "failure");
  });

  it("should throw error for invalid url  ", async () => {
    const res = await request(app).post("/api/auth/loginn").send({
      username: "admin",
    });

    expect(res.status).to.be.equal(404);
  });
});

describe("update user", () => {
  it("should return success after updating details", async () => {
    const res = await request(app).put("/api/user/update").send({
      name: "yogeshwaran",
      email: "mryog@gmail.com",
      password: "yogesh",
    });

    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property("msg", "details updated");
  });

  it("should return error for invalid email", async () => {
    const res = await request(app).put("/api/user/update").send({
      name: "yogesh",
      email: "yogessdcgeeh@gmaill.com",
      password: "yogi",
    });

    expect(res.status).to.be.equal(400);
    expect(res.body).to.have.property("msg", "Error");
  });
});

describe("delete user", () => {
  it("should return success after deleting the user", async () => {
    const res = await request(app).put("/api/user/delete").send({
      email: "mryog@gmail.com",
    });

    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property("msg", "user deleted");
  });

  it("should return error for wrong email id", async () => {
    const res = await request(app).put("/api/user/delete").send({
      email: "yogeshnskshsmcl@gmaill.com",
    });

    expect(res.status).to.be.equal(400);
    expect(res.body).to.have.property("msg", "user not found");
  });
});

describe("get user by id", () => {
  it("should return user data", async () => {
    const res = await request(app).get("/api/user/66cdcaa139842ebc260849e7");

    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property("_id", "66cdcaa139842ebc260849e7");
  });

  it("should return error for invalid id", async () => {
    const res = await request(app).get("/api/user/1726");

    expect(res.status).to.be.equal(400);
    expect(res.body).to.have.property("msg", "user not found");
  });
});
