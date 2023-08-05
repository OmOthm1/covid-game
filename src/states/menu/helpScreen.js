import { Button, ButtonList } from "../button.js";
import Game from "../../game.js";
import ImageManager from "../../engine/imageManager.js";
import { FONT } from "../../engine/preferences.js";
import { isMobile } from "../../index.js";

export default class HelpScreen {
    constructor(menu) {
        this.backButton = new Button(
            'عودة',
            () => { menu.activeScreen = 'main' }
        );
        this.backButton.style.focused['bgColor'] = 'black';
        this.backButton.style.focused['textColor'] = 'white';
        // this.backButton.style.focused['width'] = 150;
        
        this.buttonList = new ButtonList();
        this.buttonList.add(this.backButton);
        
        this.backButton.bottom = Game.HEIGHT-30;
        this.backButton.left = 30;
    }

    update() {
    }

    draw() {
        Game.ctx.drawImage(ImageManager.get('concrete'), 0, 0);
        Game.ctx.fillStyle = 'rgba(255, 255, 255, .3)';
        Game.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

        if (isMobile) {
            this.drawForMobile();
        } else {
            this.drawForDesktop();
        }

        this.buttonList.draw();
    }

    drawForMobile() {
        Game.ctx.fillStyle = 'black';
        Game.ctx.textAlign = 'center';
        Game.ctx.textBaseline = 'top';
        
        Game.ctx.font = `58px ${FONT}`;
        Game.ctx.fillText(
            'التحكم',
            Game.WIDTH/2,
            50
        );

        Game.ctx.font = `22px ${FONT}`;
        Game.ctx.textAlign = 'right';

        Game.ctx.fillText(
            'لتحريك اللاعب إلى نقطة ما اضغط باصبعك مع الاستمرار عند تلك النقطة -',
            Game.WIDTH - 50,
            200
        );

        Game.ctx.fillText(
            'للهجوم اضغط على أي مكان بالشاشة -',
            Game.WIDTH - 66,
            250
        );

        Game.ctx.fillText(
            'استمر في الضغط على الشاشة لفترة أطول لتخزين الطاقة وإطلاق ضربة أكبر عند الإفلات -',
            Game.WIDTH - 79,
            300
        );
        
        Game.ctx.fillText(
            'تلميح: يمكن استخدام اصبعين في نفس الوقت أحدهما للحركة والآخر للهجوم -',
            Game.WIDTH - 62,
            350
        );

    }

    drawForDesktop() {
        const basePosX = Game.WIDTH - 80;
        const basePosY = 170;

        Game.ctx.fillStyle = 'black';
        Game.ctx.textAlign = 'center';
        Game.ctx.textBaseline = 'top';
        
        Game.ctx.font = `58px ${FONT}`;
        Game.ctx.fillText(
            'التحكم',
            Game.WIDTH/2,
            50
        );

        Game.ctx.font = `22px ${FONT}`;
        
        const arrow_keys_img = ImageManager.get('arrow_keys');
        Game.ctx.drawImage(arrow_keys_img, basePosX - arrow_keys_img.width, basePosY);
        Game.ctx.fillText(
            'تحريك الشخصية',
            basePosX - arrow_keys_img.width/2,
            basePosY + arrow_keys_img.height + 20
        );

        const space_bar_img = ImageManager.get('space_bar');
        Game.ctx.drawImage(space_bar_img, basePosX - space_bar_img.width - 300, basePosY + 20);
        Game.ctx.fillText(
            'الهجوم',
            basePosX - space_bar_img.width/2 - 300,
            basePosY + arrow_keys_img.height + 20
        );


        const p_key_img = ImageManager.get('P_key');
        Game.ctx.drawImage(p_key_img, 430, basePosY + 20);
        Game.ctx.fillText(
            'إيقاف/استئناف اللعبة',
            430 + p_key_img.width/2,
            basePosY + arrow_keys_img.height + 20
        );


        const m_key_img = ImageManager.get('M_key');
        Game.ctx.drawImage(m_key_img, 130, basePosY + 20);
        Game.ctx.fillText(
            'كتم/تشغيل الموسيقى',
            130 + m_key_img.width/2,
            basePosY + arrow_keys_img.height + 20
        );

        // -----
        
        Game.ctx.textAlign = 'right';

        Game.ctx.fillText(
            ':يمكنك أيضا التحكم من الفأرة -',
            Game.WIDTH - 50,
            450
        );

        Game.ctx.fillText(
            'لتحريك اللاعب إلى نقطة ما اضغط مع الاستمرار على زر الفأرة الأيسر عند تلك النقطة *',
            Game.WIDTH - 100,
            500
        );

        Game.ctx.fillText(
            'زر الفأرة الأيسر يستخدم في نفس الوقت للهجوم *',
            Game.WIDTH - 110,
            550
        );

        Game.ctx.fillText(
            'استمر في الضغط على زر الهجوم لفترة أطول لتخزين الطاقة وإطلاق ضربة أكبر عند الإفلات -',
            Game.WIDTH - 66,
            620
        );
    }
}