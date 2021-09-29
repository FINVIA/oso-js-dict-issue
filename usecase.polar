allow(actor, action, resource) if
    has_permission(actor, action, resource);

actor JWT {}

resource AResource {
    permissions = ["read"];
    roles = ["owner", "admin"];
    "read" if "owner";
    "read" if "admin";
}

has_role(user: JWT, "owner", res: AResource) if
    user.sub = res.ownerId;


has_role(user: JWT, "admin", _res: AResource) if
    group in user.ext.groups and
    allowed_group in ["HumanAdmin", "MachineAdmin"] and
    group = allowed_group;

# This one works
#?= allow(new JWT("userId", { groups: [] }), "read", new AResource("userId"));

# This one does not
#?= allow(new JWT("userId", { groups: ["HumanAdmin"] }), "read", new AResource("anotherUserId"));
