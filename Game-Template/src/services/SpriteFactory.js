import PlayerStateName from "../enums/PlayerStateName.js";
import Sprite from "../../lib/Sprite.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Player from "../entities/Player.js";

export default class SpriteFactory
{
    static getSprite(type)
    {
        switch (type)
        {
            case PlayerStateName.Idle:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerIdle),
                    Player.WIDTH,
                    Player.HEIGHT
                );
            case PlayerStateName.Walking:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerWalking),
                    Player.WIDTH,
                    Player.HEIGHT
                );
            case PlayerStateName.Running:
                return Sprite.generateSpritesFromSpriteSheet
			    (
			    	images.get(ImageName.PlayerRunning),
			    	Player.WIDTH,
			    	Player.HEIGHT
                );
            case PlayerStateName.Falling:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerFalling),
                    Player.WIDTH,
                    Player.HEIGHT
                );
            case PlayerStateName.Ducking:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerDucking),
                    Player.WIDTH,
                    Player.HEIGHT
                );
            case PlayerStateName.Jumping:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerJumping),
                    Player.WIDTH,
                    Player.HEIGHT
                );
            case PlayerStateName.DoubleJumping:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerDoubleJumping),
                    Player.WIDTH,
                    Player.HEIGHT
                );
            case PlayerStateName.Charging:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerCharging),
                    Player.WIDTH + 8,
                    Player.HEIGHT + 8
                );
            case PlayerStateName.Floating:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerFloating),
                    Player.WIDTH,
                    Player.HEIGHT + 8
                );
            case PlayerStateName.Aiming:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerAiming),
                    Player.WIDTH + 8,
                    Player.HEIGHT + 8
                );
            case PlayerStateName.Firing:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerFiring),
                    22,
                    36
                );
            case PlayerStateName.Sleeping:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerSleeping),
                    16,
                    32
                );
            case PlayerStateName.Hurting:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerHurting),
                    16,
                    16
                );
            case PlayerStateName.Dying:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.PlayerDying),
                    256,
                    256
                );
            case PlayerStateName.Arrow:
                return Sprite.generateSpritesFromSpriteSheet
                (
                    images.get(ImageName.Items),
                    16,
                    16
                )[2];
        }
    }
}