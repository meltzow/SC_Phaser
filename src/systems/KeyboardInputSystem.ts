public class KeyboardInputSystem extends BaseSystem {
    
        constructor() {
            KeyboardInput
        }

        protected void registerSets() {
            registerDefault(KeyboardInput.class, CameraComponent.class);
        }
    
        protected void onEntityAdded(Entity e) {
            onEntityUpdated(e);
        }
    
        protected void update(game: Game, Entity e) {
            CameraComponent camera = e.get(CameraComponent.class);
            KeyboardInput keyInput = e.get(KeyboardInput.class);
    
            KeyCode keyCode = keyInput.getKeyCode();
    
            switch (keyCode) {
                case W:
                game.camera.y += 4;
        
                    camera.setNextMove(CameraComponent.MOVE.STRAFE_SOUTH);
                    break;
                case S:
                    camera.setNextMove(CameraComponent.MOVE.STRAFE_NORTH);
                    break;
                case A:
                    camera.setNextMove(CameraComponent.MOVE.STRAFE_WEST);
                    break;
                case D:
                    camera.setNextMove(CameraComponent.MOVE.STRAFE_EAST);
                    break;
                case E:
                    camera.setNextMove(CameraComponent.MOVE.ROTATE_RIGHT);
                default:
                    break;
            }
            entityData.setComponent(e.getId(), camera);
            entityData.removeComponent(e.getId(), KeyboardInput.class);
        }
    
    
    }