if (navigator.getBattery) {
    const battery = new BarItem('battery');

    navigator.getBattery().then((bt) => {
        battery.setText((bt.charging ? '⚡' : '🔋') + ' ' + Math.round(bt.level * 100) + '%');

        bt.addEventListener("levelchange", () => {
            battery.setText((bt.charging ? '⚡' : '🔋') + ' ' + Math.round(bt.level * 100) + '%');
        });

        bt.addEventListener("chargingchange", () => {
            battery.setText((bt.charging ? '⚡' : '🔋') + ' ' + Math.round(bt.level * 100) + '%');
        });
    });
}