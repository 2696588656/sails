/**
 * Created by lyh on 8/8/16.
 */

module.exports={
  connection: 'someMongodbServer',
  tableName: 'xd_autotest_testdoc',
  attributes: {
    id: {
      type: 'string',
      required: true,
      unique: true,
      primaryKey: true
    },
    name: {
      type: 'string',
      required: true,
      unique: true
    },

    /**
     * 一个doc与docItem是one-to-many的关系,
     * 可通过doc与docItem的引用指向来相互关联,
     * 参考:http://sailsjs.org/documentation/concepts/models-and-orm/associations/one-to-many
     * */
    doc_items: {
      collection: 'testdoc',
      via: 'docID'
    }
  }
}
