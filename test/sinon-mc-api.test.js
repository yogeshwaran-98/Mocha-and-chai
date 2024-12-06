import { use, expect } from "chai";
import Sinon from "sinon";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);
import app from "../server.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const request = chai.request.execute;
chai.expect();

describe("register check", () => {
  let stub;

  beforeEach(() => {
    stub = Sinon.stub(User, "create");
  });

  afterEach(() => {
    stub.restore();
  });

  it("should return success msg for successful registration", async () => {
    const newUser = {
      name: "yogeshw",
      email: "yogeshssgs@gmail.com",
      password: "yogi",
    };

    stub.resolves({
      id: "mockid123",
      name: newUser.name,
      email: newUser.email,
    });

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property("msg", "User created successfully");
  });

  it("should return failure msg for unsuccessful registration", async () => {
    const newUser = {
      name: "yogeshw",
      email: "yogeshssgs@gmail.com",
    };

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.status).to.be.equal(400);
    expect(res.body).to.have.property("msg", "missing fields");
  });
});

describe("login check", () => {
  let stub;
  let stubCompare;

  beforeEach(() => {
    stub = Sinon.stub(User, "findOne");

    stubCompare = Sinon.stub(bcrypt, "compare");
  });

  afterEach(() => {
    stub.restore();
    stubCompare.restore();
  });

  it("should return status as success for valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("ganesh", 10);
    stub.resolves({
      _id: "67527da7ca73c6b24d562076",
      name: "ganesh",
      email: "ganesh@gmail.com",
      password: hashedPassword,
      createdAt: "2024-12-06T04:29:27.454Z",
      updatedAt: "2024-12-06T04:29:27.454Z",
      __v: 0,
      toObject: function () {
        return {
          _id: this._id,
          name: this.name,
          email: this.email,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          password: this.password,
        };
      },
    });

    stubCompare.resolves(true);

    const res = await request(app).post("/api/auth/login").send({
      name: "ganesh",
      password: "ganesh",
    });

    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property("msg", "login success");
    expect(res.body).to.have.property("user");
  });

  it("should return status as failure for incorrect username", async () => {
    const res = await request(app).post("/api/auth/login").send({
      name: "adminn",
      password: "admin",
    });

    stub.resolves(null);

    expect(res.status).to.be.equal(401);
    expect(res.body).to.have.property("msg", "Incorrect username or password");
  });

  it("should return status as failure for incorrect password", async () => {
    const hashedPassword = bcrypt.hash("admin");
    const res = await request(app).post("/api/auth/login").send({
      name: "admin",
      password: hashedPassword,
    });

    stubCompare.resolves(false);

    expect(res.status).to.be.equal(401);
    expect(res.body).to.have.property("msg", "Incorrect username or password");
  });

  it("should throw error for invalid url  ", async () => {
    const res = await request(app).post("/api/auth/loginn").send({
      username: "admin",
    });

    expect(res.status).to.be.equal(404);
  });
});
