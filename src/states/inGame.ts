import * as Assets from '../assets';
import * as Chk from 'bw-chk';


export default class InGame extends Phaser.State {
    entities: Array<Object> = [];
    nextEntityId: 0;

    public create(): void {
        let map = {
            visual: {
                image: 'http://example.example/robotimage.png'
            }
        };
        this.entities.push(map);
    }

    public update(): void {
        console.log('updated');
    }
}
