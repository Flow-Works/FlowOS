window.onerror = (e) => {
    new WinBox({
        title: "Error",
        html:
            '<div class="err">' +
            e +
            "<style>.err { padding: 5px; }</style></div>",
        x: "center",
        y: "center",
        width: "300px",
        height: "200px",
    });
};