const migrate = require('./lib/migrate');

require('./lib')(async (db) => {
	// await migrate( db().container("_checkin_form_question"), db("prod").container("_checkin_form_question"));
  // await migrate( db().container("_checkin_health_check"), db("prod").container("_checkin_health_check"));
  // await migrate( db().container("_checkin_office_sector"), db("prod").container("_checkin_office_sector"));
  // await migrate( db().container("_checkin_office_status"), db("prod").container("_checkin_office_status"));
  // await migrate( db().container("_checkin_reserve"), db("prod").container("_checkin_reserve"));
  // await migrate( db().container("_checkin_table"), db("prod").container("_checkin_table"));
  // await migrate( db().container("_checkin_user_privileges"), db("prod").container("_checkin_user_privileges"));

  // await db("prod").container("_checkin_form_question").query("select * from c");
  // await db("prod").container("_checkin_office_sector").query("select * from c");
  // await db("prod").container("_checkin_office_status").query("select * from c");
  // await db("prod").container("_checkin_table").query("select * from c");
  // await db("prod").container("_checkin_user_privileges").query("select * from c");
  await db("prod").container("_checkin_reserve").deleteByQuery("select * from c");
  await db("prod").container("_checkin_health_check").deleteByQuery("select * from c");

})
