export const metadata = {
    cmd: 'config',
    description: 'Change LocalStorage keys.'
};

export const exec = (fs, term, usr, dir, args) => {
    var values=[];
    var secondArgPos = 0;
    if(args.length==1) {return "Change Localstorage Keys"}
    if(args.length!=2) {
        if(!args[2].includes('"')) {
            values[0]=args[2];
            secondArgPos=3;
        }
        else {
            value = args[2].replace('"',"");
            var closedText=false;
            for(var x=2; x < args.length; x++) {
                if(x>2) {value+=args[x+1].replace('"',"");}
                if(value.includes('"')) {closedText=true; secondArgPos=x; break;}
                x++;
            };
            if(!closedText) {}
            values[0]=value;
        }
    }
    if(args.length!=3) {
        if(!args[secondArgPos].includes('"')) {
            values[1]=args[secondArgPos];
        }
        else {
            value = args[secondArgPos].replace('"',"");
            var closedText=false;
            for(var x=secondArgPos; x < args.length; x++) {
                if(x>secondArgPos) {value+=args[x+1].replace('"',"");}
                if(value.includes('"')) {closedText=true; break;}
                x++;
            };
            if(!closedText) {}
            values[0]=value;
        }
    }
    if(args[1]=="set") {
        localStorage.setItem(values[0], values[1]);
        return "Set the value of "+ values[0] + " to: "+ values[1];
    }
    if(args[1]=="get") {
        return localStorage.getItem(values[0]);
    }
    if(args[1]=="clear") {
        if(args.length==2) {localStorage.clear(); return "Cleared LocalStorage (run config reset to repair)"}
        localStorage.clear(values[0]);
        return "Cleared the value of: "+ values[0];
    }
    if(args[1]=="reset") {
        localStorage.clear();
        localStorage.setItem("css", "");
        localStorage.setItem("modules", '{"urls":["/builtin/modules/battery.js","/builtin/modules/clock.js","/builtin/modules/weather.js"]}');
        localStorage.setItem("search", '{"url":"https://duckduckgo.com","urls":[""],"proxy":"Ultraviolet"}');
        localStorage.setItem("__test__", "�");
        localStorage.setItem("theme", '{"url":"/builtin/themes/catppuccin-macchiato.css"}');
        localStorage.setItem("flowgpt", '{"model":"gpt-3.5-turbo"}');
        localStorage.setItem("apps", "[]");
        localStorage.setItem("weather", '{"city":"London","measurement":"Celsius"}');
        localStorage.setItem("custom-apps", "[]");
        return "Reseted LocalStorage";
    }
    return args[1];

};