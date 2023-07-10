function loadScript(sources, callBack) {
    var script      = document.createElement('script');
    script.src      = sources;
    script.async    = false; 
    document.body.appendChild(script); 
    
    script.addEventListener('load', () => {
        if(typeof callBack == "function") callBack(sources);
    });
}

loadScript('https://flow-works.github.io/appstore/apps.js', () => {
    Object.values(appStore).forEach((data) => {
        const a = document.createElement('a');
        a.classList.add('tooltip')
        a.href = "#";

        const span = document.createElement('span');
        if (config.apps.get()[data.APP_ID]) {
            span.innerText = data.title + ' (Installed)';
        } else {
            span.innerText = data.title;
        }
        a.appendChild(span);
    
        const img = document.createElement('img');
        img.setAttribute('width', '100px');
        img.src = '/assets/icons/' + data.APP_ID + '.svg';
        a.appendChild(img);

        function isInArray(value, array) {
            return array.indexOf(value) > -1;
        }
    
        a.onclick = () => {
            const obj = { ...config.apps.get() };
            obj[data.APP_ID] = data;
            config.apps.set(obj);
            new parent.WinBox({
                title: 'Information',
                html: '<div class="err">' + `Successfully installed ${data.title}! Restart FlowOS to apply changes.` + '<style>.err { padding: 5px; }</style></div>',
                x: 'center',
                y: 'center',
                width: '300px',
                height: '200px'
            })
        }
    
        document.querySelector('.apps').appendChild(a)
    });

    var tooltips = document.querySelectorAll('.tooltip span');

window.onmousemove = function (e) {
    var x = (e.clientX + 20) + 'px',
        y = (e.clientY + 20) + 'px';
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].style.top = y;
        tooltips[i].style.left = x;
    }
};
});