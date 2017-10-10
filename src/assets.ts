/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */

export namespace Images {
    export class BallShadow {
        static getName(): string { return 'ball_shadow'; }

        static getPNG(): string { return require('assets/ball_shadow.png'); }
    }
    export class Ball {
        static getName(): string { return 'ball'; }

        static getPNG(): string { return require('assets/ball.png'); }
    }
    export class Block {
        static getName(): string { return 'block'; }

        static getPNG(): string { return require('assets/block.png'); }
    }
    export class Floor {
        static getName(): string { return 'floor'; }

        static getPNG(): string { return require('assets/floor.png'); }
    }
    export class GreenTile {
        static getName(): string { return 'green_tile'; }

        static getPNG(): string { return require('assets/green_tile.png'); }
    }
    export class HeroTile {
        static getName(): string { return 'hero_tile'; }

        static getPNG(): string { return require('assets/hero_tile.png'); }
    }
    export class ImagesBackgroundTemplate {
        static getName(): string { return 'background_template'; }

        static getPNG(): string { return require('assets/images/background_template.png'); }
    }
    export class ImgCharasOverlord {
        static getName(): string { return 'Overlord'; }

        static getPNG(): string { return require('assets/img/Charas/Overlord.png'); }
    }
    export class ImgCharasZergling {
        static getName(): string { return 'Zergling'; }

        static getPNG(): string { return require('assets/img/Charas/Zergling.png'); }
    }
    export class RedTile {
        static getName(): string { return 'red_tile'; }

        static getPNG(): string { return require('assets/red_tile.png'); }
    }
}

export namespace Spritesheets {
    export class SpritesheetsMetalslugMummy374518 {
        static getName(): string { return 'metalslug_mummy.[37,45,18,0,0]'; }

        static getPNG(): string { return require('assets/spritesheets/metalslug_mummy.[37,45,18,0,0].png'); }
        static getFrameWidth(): number { return 37; }
        static getFrameHeight(): number { return 45; }
        static getFrameMax(): number { return 18; }
        static getMargin(): number { return 0; }
        static getSpacing(): number { return 0; }
    }
    export class SpritesheetsOverlord848472 {
        static getName(): string { return 'Overlord.[84,84,72,0,0]'; }

        static getPNG(): string { return require('assets/spritesheets/Overlord.[84,84,72,0,0].png'); }
        static getFrameWidth(): number { return 84; }
        static getFrameHeight(): number { return 84; }
        static getFrameMax(): number { return 72; }
        static getMargin(): number { return 0; }
        static getSpacing(): number { return 0; }
    }
}

export namespace Atlases {
    enum AtlasesPreloadSpritesArrayFrames {
        PreloadBar = <any>'preload_bar.png',
        PreloadFrame = <any>'preload_frame.png',
    }
    export class AtlasesPreloadSpritesArray {
        static getName(): string { return 'preload_sprites_array'; }

        static getJSONArray(): string { return require('assets/atlases/preload_sprites_array.json'); }

        static getPNG(): string { return require('assets/atlases/preload_sprites_array.png'); }

        static Frames = AtlasesPreloadSpritesArrayFrames;
    }
    enum AtlasesPreloadSpritesHashFrames {
        PreloadBar = <any>'preload_bar.png',
        PreloadFrame = <any>'preload_frame.png',
    }
    export class AtlasesPreloadSpritesHash {
        static getName(): string { return 'preload_sprites_hash'; }

        static getJSONHash(): string { return require('assets/atlases/preload_sprites_hash.json'); }

        static getPNG(): string { return require('assets/atlases/preload_sprites_hash.png'); }

        static Frames = AtlasesPreloadSpritesHashFrames;
    }
    enum AtlasesPreloadSpritesXmlFrames {
        PreloadBar = <any>'preload_bar.png',
        PreloadFrame = <any>'preload_frame.png',
    }
    export class AtlasesPreloadSpritesXml {
        static getName(): string { return 'preload_sprites_xml'; }

        static getPNG(): string { return require('assets/atlases/preload_sprites_xml.png'); }

        static getXML(): string { return require('assets/atlases/preload_sprites_xml.xml'); }

        static Frames = AtlasesPreloadSpritesXmlFrames;
    }
    enum Hero844162Frames {
        H1 = <any>'h1.png',
        H10 = <any>'h10.png',
        H11 = <any>'h11.png',
        H12 = <any>'h12.png',
        H13 = <any>'h13.png',
        H14 = <any>'h14.png',
        H15 = <any>'h15.png',
        H16 = <any>'h16.png',
        H17 = <any>'h17.png',
        H18 = <any>'h18.png',
        H19 = <any>'h19.png',
        H2 = <any>'h2.png',
        H20 = <any>'h20.png',
        H21 = <any>'h21.png',
        H22 = <any>'h22.png',
        H23 = <any>'h23.png',
        H24 = <any>'h24.png',
        H25 = <any>'h25.png',
        H26 = <any>'h26.png',
        H27 = <any>'h27.png',
        H28 = <any>'h28.png',
        H29 = <any>'h29.png',
        H3 = <any>'h3.png',
        H30 = <any>'h30.png',
        H31 = <any>'h31.png',
        H32 = <any>'h32.png',
        H4 = <any>'h4.png',
        H5 = <any>'h5.png',
        H6 = <any>'h6.png',
        H7 = <any>'h7.png',
        H8 = <any>'h8.png',
        H9 = <any>'h9.png',
    }
    export class Hero844162 {
        static getName(): string { return 'hero_8_4_41_62'; }

        static getJSONArray(): string { return require('assets/hero_8_4_41_62.json'); }

        static getPNG(): string { return require('assets/hero_8_4_41_62.png'); }

        static Frames = Hero844162Frames;
    }
}

export namespace Audio {
    export class AudioMusic {
        static getName(): string { return 'music'; }

        static getAC3(): string { return require('assets/audio/music.ac3'); }
        static getM4A(): string { return require('assets/audio/music.m4a'); }
        static getMP3(): string { return require('assets/audio/music.mp3'); }
        static getOGG(): string { return require('assets/audio/music.ogg'); }
    }
}

export namespace Audiosprites {
    enum AudiospritesSfxSprites {
        Laser1 = <any>'laser1',
        Laser2 = <any>'laser2',
        Laser3 = <any>'laser3',
        Laser4 = <any>'laser4',
        Laser5 = <any>'laser5',
        Laser6 = <any>'laser6',
        Laser7 = <any>'laser7',
        Laser8 = <any>'laser8',
        Laser9 = <any>'laser9',
    }
    export class AudiospritesSfx {
        static getName(): string { return 'sfx'; }

        static getAC3(): string { return require('assets/audiosprites/sfx.ac3'); }
        static getJSON(): string { return require('assets/audiosprites/sfx.json'); }
        static getM4A(): string { return require('assets/audiosprites/sfx.m4a'); }
        static getMP3(): string { return require('assets/audiosprites/sfx.mp3'); }
        static getOGG(): string { return require('assets/audiosprites/sfx.ogg'); }

        static Sprites = AudiospritesSfxSprites;
    }
}

export namespace GoogleWebFonts {
    export const Barrio: string = 'Barrio';
}

export namespace CustomWebFonts {
    export class Fonts2DumbWebfont {
        static getName(): string { return '2Dumb-webfont'; }

        static getFamily(): string { return '2dumbregular'; }

        static getCSS(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.css'); }
        static getEOT(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.eot'); }
        static getSVG(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.svg'); }
        static getTTF(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.ttf'); }
        static getWOFF(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.woff'); }
    }
}

export namespace BitmapFonts {
    export class Font {
        static getName(): string { return 'font'; }

        static getPNG(): string { return require('assets/font.png'); }
        static getXML(): string { return require('assets/font.xml'); }
    }
    export class FontsFontFnt {
        static getName(): string { return 'font_fnt'; }

        static getFNT(): string { return require('assets/fonts/font_fnt.fnt'); }
        static getPNG(): string { return require('assets/fonts/font_fnt.png'); }
    }
    export class FontsFontXml {
        static getName(): string { return 'font_xml'; }

        static getPNG(): string { return require('assets/fonts/font_xml.png'); }
        static getXML(): string { return require('assets/fonts/font_xml.xml'); }
    }
}

export namespace JSON {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace XML {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Text {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Scripts {
    export class ScriptsBlurX {
        static getName(): string { return 'BlurX'; }

        static getJS(): string { return require('assets/scripts/BlurX.js'); }
    }
    export class ScriptsBlurY {
        static getName(): string { return 'BlurY'; }

        static getJS(): string { return require('assets/scripts/BlurY.js'); }
    }
}
export namespace Shaders {
    export class ShadersPixelate {
        static getName(): string { return 'pixelate'; }

        static getFRAG(): string { return require('assets/shaders/pixelate.frag'); }
    }
}
export namespace Misc {
    export class Challeneger {
        static getName(): string { return 'Challeneger'; }

        static getFile(): string { return require('assets/Challeneger.chk'); }
    }
}
