/**
 * Proposta:

Update By Id
Delete By ID
Insert Register
Select By Query ou JS Queries
Upsert
Bulk
    Update By Query
    Delete By Query


db("NomeDoDB").Collection('')
 */


require('./lib')(async (db) => {
    // await db().container('_checkin_form_question').query(`select * from c`);
    
    // await db().container('_checkin_form_question').create({
    //     "partitionKey": "simpleteste",
    //     "affirmativeOption": {
    //         "id": "f6446902-6254-11ec-90d6-0242ac120003",
    //         "reserveBlockable": true
    //     },
    //     "negativeOption": {
    //         "id": "f6446a1a-6254-11ec-90d6-0242ac120003",
    //         "reserveBlockable": false
    //     },
    //     "observationId": "",
    //     "id": "simpleteste",
    // })
    
    // await db().container('_checkin_form_question').getById("simpleteste", "simpleteste");
    
    //await db().container('_checkin_form_question').delete("simpleteste", "simpleteste");

    // await db().container('_checkin_form_question')
    //     .deleteByQuery(`c.id = 'simpleteste'`, c => c.id, c => c.partitionKey);
    
    // await db().container('_checkin_form_question')
        //  .deleteByListId([{
            //  id: 'simpleteste',
            //  partitionKey: 'simpleteste'
        //  }]);

    // await db().container('_checkin_form_question').updateFields({"foo": "bar", "tar": "gz"}, "simpleteste", "simpleteste");
    
    // await db().container('_checkin_form_question').updateByQuery(`c.id = 'simpleteste'`, {"foo": "bar", "tar": "gz"});

    // await db().container('_checkin_form_question').getById("simpleteste", "simpleteste");


    
})
