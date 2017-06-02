/**
 * Created by yaniv on 5/31/17.
 */
/**
 * Created by yaniv on 5/29/17.
 */
if (process.env.NODE_ENV === 'yaniv') {
    var env = process.env.TUT_NODE_ENV;
    if (env === 'development') {
        process.env.PORT = 4001;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    } else if (env === 'test') {
        process.env.PORT = 4001;
        //define a different DB in test
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    }
}


