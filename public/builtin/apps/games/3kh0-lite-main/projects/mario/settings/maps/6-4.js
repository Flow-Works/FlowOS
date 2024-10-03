FullScreenMario.FullScreenMario.settings.maps.library["6-4"] = {
    "name": "6-4",
    "time": 300,
    "locations": [
        { "entry": "Castle" }
    ],
    "areas": [
        {
            "setting": "Castle",
            "blockBoundaries": true,
            "creation": [
                { "macro": "StartInsideCastle" },
                { "thing": "Stone", "y": 88, "width": 192, "height": 24 },
                { "macro": "Floor", "x": 40, "y": 24, "width": 64 },
                { "macro": "Water", "x": 104, "y": 8, "width": 16 },
                { "macro": "Floor", "x": 120, "y": 24, "width": 88 },
                { "thing": "Stone", "x": 184, "y": 64 },
                { "thing": "CastleBlock", "x": 184, "y": 56, "fireballs": 6 },
                { "thing": "Stone", "x": 192, "y": 88, "width": 1088 },
                { "macro": "Water", "x": 208, "width": 24 },
                { "thing": "Podoboo", "x": 216, "y": -32 },
                { "macro": "Floor", "x": 232, "y": 24, "width": 24 },
                { "thing": "CastleBlock", "x": 240, "y": 24, "fireballs": 6 },
                { "thing": "Block", "x": 240, "y": 56, "contents": "Mushroom" },
                { "macro": "Water", "x": 256, "width": 24 },
                { "thing": "Podoboo", "x": 264, "y": -32 },
                { "thing": "Stone", "x": 280, "y": 32, "width": 296 },
                { "thing": "Stone", "x": 280, "y": 24, "width": 552, "height": 24 },
                { "macro": "Floor", "x": 280, "width": 744 },
                { "thing": "Stone", "x": 296, "y": 80, "width": 280, "height": 24 },
                { "thing": "CastleBlock", "x": 296, "y": 56, "fireballs": 6 },
                { "thing": "CastleBlock", "x": 392, "y": 56, "fireballs": 6 },
                { "thing": "CastleBlock", "x": 480, "y": 56, "fireballs": 6 },
                { "thing": "CastleBlock", "x": 536, "y": 56, "fireballs": 6 },
                { "thing": "CastleBlock", "x": 608, "y": 32, "fireballs": 6 },
                { "thing": "Stone", "x": 640, "y": 80 },
                { "thing": "CastleBlock", "x": 640, "y": 72, "fireballs": 6 },
                { "thing": "CastleBlock", "x": 672, "y": 32, "fireballs": 6 },
                { "thing": "Stone", "x": 704, "y": 80 },
                { "thing": "CastleBlock", "x": 704, "y": 72, "fireballs": 6, "direction": 1 },
                { "thing": "CastleBlock", "x": 736, "y": 32, "fireballs": 6 },
                { "thing": "Stone", "x": 776, "y": 80, "width": 56, "height": 16 },
                { "macro": "Fill", "thing": "Block", "x": 848, "y": 32, "xnum": 3, "xwidth": 24, "contents": "Coin", "hidden": true },
                { "macro": "Fill", "thing": "Block", "x": 856, "y": 64, "xnum": 3, "xwidth": 24, "contents": "Coin", "hidden": true },
                { "thing": "Stone", "x": 928, "y": 24, "width": 32, "height": 24 },
                { "thing": "Stone", "x": 984, "y": 24, "width": 40, "height": 24 },
                { "thing": "Stone", "x": 984, "y": 80, "width": 40, "height": 16 },
                { "macro": "EndInsideCastle", "x": 1024, "spawnType": "Blooper", "throwing": true, "transport": { "map": "7-1" } }
            ]
        }
    ]
};