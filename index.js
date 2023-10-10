const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "User.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/users/:user_id/level/:level_id", async (request, response) => {
  const { user_id, level_id } = request.params;

  //Users Commented On Same Blog

  if (level_id == 1) {
    const get_query = `select comment.user_id as UserId, comment.blog_id as BlogId from user join comment  on user.user_id = comment.user_id group by comment.blog_id;`;

    const result = await db.all(get_query);

    response.send(result);
  } else {
    const to_get_user_id_blog = `select * from user join comment on user.user_id = comment.user_id where user.user_id = ${user_id}`;

    const main = await db.get(to_get_user_id_blog);

    if (main !== undefined) {
      const get_main_query = `select comment.user_id as UserId ,blog.blog_id as BlogId from blog join comment on blog.blog_id = comment.blog_id where blog.blog_id = ${main.blog_id}`;

      const main_result = await db.all(get_main_query);

      response.send(main_result);
    }
  }
});
