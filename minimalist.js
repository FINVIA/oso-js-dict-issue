const { Oso } = require("oso");

class User {
    constructor(opts) {
        this.opts = opts;
    }
}

const run = async () => {
    const oso = new Oso();
    oso.registerClass(User);
    await oso.loadStr(`
actor User {}

?= (new User(1)).opts = 1;
?= (new User({foo: 1})).opts.foo = 1;
    `);
};

run();