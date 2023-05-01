export default class ImageManager {
    static images = {};

    static configure() {
        ImageManager.add('boots',            'boots.png');
        ImageManager.add('potion',           'potion.png');
        ImageManager.add('heart',            'heart.png');
        ImageManager.add('speaker',          'speaker.png');
        ImageManager.add('muted',            'muted.png');
        ImageManager.add('house',            'house.png');
        ImageManager.add('warning',          'warning.png');
        ImageManager.add('mom',              'mom.png');
        ImageManager.add('concrete',         'concrete.jpg');
        ImageManager.add('player_L_1',       'player_L_1.png');
        ImageManager.add('player_L_2',       'player_L_2.png');
        ImageManager.add('player_R_1',       'player_R_1.png');
        ImageManager.add('player_R_2',       'player_R_2.png');
        ImageManager.add('virus1',           'virus1.svg');
        ImageManager.add('virus2',           'virus2.png');
        ImageManager.add('virus3',           'virus3.png');
        ImageManager.add('arrow_keys',       'arrow_keys.png');
        ImageManager.add('space_bar',        'space_bar.png');
        ImageManager.add('P_key',            'P_key.png');
        ImageManager.add('M_key',            'M_key.png');
        ImageManager.add('logo',             'logo.png');
        ImageManager.add('mylogo',           'mylogo.svg');
        ImageManager.add('mask',             'mask.png');
        ImageManager.add('player_L_mask',    'player_L_mask.png');
        ImageManager.add('player_R_mask',    'player_R_mask.png');
    }

    static get(id) {
        return ImageManager.images[id];
    }

    static add(id, name) {
        let path = './assets/images/' + name;
        ImageManager.images[id] = new Image();
        ImageManager.images[id].src = path;
    }
}
