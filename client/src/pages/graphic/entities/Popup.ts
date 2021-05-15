/*** Start of type and namespace imports ***/

import SceneConfig = Phaser.Types.Scenes.SettingsConfig;
import ScenePlugin = Phaser.Scenes.ScenePlugin;

/*** End of type and namespace imports ***/

/**
 * This class encapsulates the process of adding a child Scene as a popup window.
 */
export class Popup extends Phaser.Scene {
  // Key of the scene used to register
  private key : string;

  // Current plugin that you are registered to
  private plugin : ScenePlugin = null;

  /**
   * Create a new Popup window initialized with a config.
   *
   * @param {string | SceneConfig} config String that represented the key / name of the Popup Scene, or a SettingsConfig object defined under Phaser.Types.Scenes.
   */
  constructor(config : string | SceneConfig) {
    super(config);

    // Set the key of the Scene for future registers to parent ScenePlugin
    if (typeof config === "string") {
      this.key = config;
    } else {
      this.key = config.key;
    }
  }

  /**
   * Add current scene to the scene specified by plugin with autostart disabled.
   * This method will auto unregister from the scene it is previously registered in.
   *
   * @param {ScenePlugin} plugin ScenePlugin to add current Popup to.
   */
  public registerToScenePlugin(plugin : ScenePlugin) : void {
    this.unregisterFromPlugin();

    // Save the parent plugin in a field
    this.plugin = plugin;

    // Add current Scene to parent plugin
    this.plugin.add(this.key, this, false);

    // Launch current Scene
    this.plugin.launch(this.key);

    this.scene.sleep();
  }

  /**
   * Remove current Scene from the ScenePlugin previously registered to.
   */
  public unregisterFromPlugin() : void {
    if (this.plugin !== null) {
      // Remove from plugin
      this.plugin.remove(this.key);
    }

    // Reset this field to null
    this.plugin = null;
  }

  /**
   * Make the Popup visible in the scene it is registered in.
   */
  public show() : void {
    this.scene.wake();
    this.scene.bringToTop();
  }

  /**
   * Hide the Popup, which effectively stops update and rendering.
   */
  public hide() : void {
    if (this.scene.isVisible()) {
      this.scene.sleep();
    }
  }

  /**
   * Draws the overlay that will be under the popup box.
   *
   * @param {number} width Width of the overlay.
   * @param {number} height Height of the overlay.
   * @param {number} [fillColor] Color of the overlay. Default is black (#000000).
   * @param {number} [fillAlpha] Alpha value between 0 and 1 that specifies the opacity of the overlay. Default value is 0.2 or 20%.
   */
  protected drawOverlay(width : number, height : number, fillColor ?: number, fillAlpha ?: number) : void { 
    this.add.rectangle(0, 0, width, height, fillColor || 0, fillAlpha || 0.2).setOrigin(0, 0);
  }

  /**
   * Draws the actual popup window box.
   *
   * @param {number} x X-coordinate of the center of the box.
   * @param {number} y Y-coordinate of the center of the box.
   * @param {number} width Width of the window.
   * @param {number} height Height of the window.
   * @param {number} [fillColor] Color of the window. Default is white (#FFFFFF).
   * @param {number} [fillAlpha] Alpha value between 0 and 1 that specifies the opacity of the window. Default value is 1 or 100%.
   */
  protected drawWindow(x : number, y : number, width : number, height : number, fillColor ?: number, fillAlpha ?: number) : void {
    this.add.rectangle(x, y, width, height, fillColor || 0xffffff, fillAlpha || 1);
  }
}
