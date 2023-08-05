const map = {
    boots:            'boots.png',
    potion:           'potion.png',
    heart:            'heart.png',
    speaker:          'speaker.png',
    muted:            'muted.png',
    house:            'house.png',
    warning:          'warning.png',
    mom:              'mom.png',
    concrete:         'concrete.jpg',
    player_L_1:       'player_L_1.png',
    player_L_2:       'player_L_2.png',
    player_R_1:       'player_R_1.png',
    player_R_2:       'player_R_2.png',
    virus1:           'virus1.svg',
    virus2:           'virus2.png',
    virus3:           'virus3.png',
    arrow_keys:       'arrow_keys.png',
    space_bar:        'space_bar.png',
    P_key:            'P_key.png',
    M_key:            'M_key.png',
    logo:             'logo.png',
    mylogo:           'mylogo.svg',
    mask:             'mask.png',
    player_L_mask:    'player_L_mask.png',
    player_R_mask:    'player_R_mask.png'
};


export default class ImageManager {
    static images = {};

    static configure() {
        for (const [key, value] of Object.entries(map)) {
            ImageManager.add(key, value);
        }
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
