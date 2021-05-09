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
   * @param {string | SceneConfig} config - String that represented the key / name of the Popup Scene, or a SettingsConfig object defined under Phaser.Types.Scenes.
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
   * @param {ScenePlugin} plugin - ScenePlugin to add current Popup to.
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
  public unregisterFromPlugin() {
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
}
