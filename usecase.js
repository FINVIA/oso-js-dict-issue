const { Oso } = require("oso");

class JWT {
    constructor(sub, ext) {
        this.sub = sub;
        this.ext = ext;
    }
}

class AResource {
    constructor(ownerId) {
        this.ownerId = ownerId;
    }
}


const run = async () => {

    const oso = new Oso();
    oso.registerClass(JWT);
    oso.registerClass(AResource);
    await oso.loadFiles(["main.polar"]);


    // Works
    await oso.authorize(new JWT("aUser", { groups: []}), "read", new AResource("aUser"));
    // Works
    await oso.authorize(new JWT("anAdmin", { groups: ["HumanAdmin"]}), "read", new AResource("aRegularUser"));


    const testEval = async (q) => {
        const result = await oso.query(q);
        const { done } = await result.next();
        if(done) {
            throw new Error(`'${q}' did not return a result`);
        }
    }
    return;
    // Should be equivalent to L26
    await testEval('allow(new JWT("userId", { groups: [] }), "read", new AResource("userId"))');
    // Should be equivalent to L28
    await testEval('allow(new JWT("anAdmin", { groups: ["HumanAdmin"] }), "read", new AResource("anotherUser"))');
};

run();