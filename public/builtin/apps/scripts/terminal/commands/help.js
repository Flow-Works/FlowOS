export const metadata = {
    cmd: 'help',
    description: 'View what different commands do.'
};


export const exec = async (fs, term, usr, dir, args) => {
    try {
        term.writeln("Fetching command...");
        var cmd ="";
        await import(window.location.origin + "/builtin/apps/scripts/terminal/commands/" + args[1] + ".js").then (async(command)=> {
            term.writeln(args[1]+": "+ await command.metadata.description);
        });
        return;
    }
    catch {
        return "Failed to fetch command";
    }
};