import { Component, Prop,  State, h } from '@stencil/core';
// import { importEsri } from '../../utils/utils';
import esriConfig from 'esri/config'
import Portal from 'esri/portal/Portal'
import {watch} from 'esri/core/reactiveUtils'
import esriId from 'esri/identity/IdentityManager'

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {

  /**
   * ArcGIS Maps SDK for JavaScript View instance
   */
  @Prop() view!: __esri.View;

  /**
   * Active ArcGIS Portal instance
   */
  @State() portal: __esri.Portal;

  /**
   * Active Portal User
   */
  @State() user: __esri.PortalUser;

  async componentWillLoad(): Promise<void> {
    // Connect to Portal from esri/config
    await this.connectPortal();
  }

  async connectPortal(): Promise<void> {
    // const esriConfig = await importEsri('esri/config');
    // const Portal = await importEsri('esri/portal/Portal');
    const portal = new Portal({
      url: esriConfig.portalUrl,
    });
    await portal.load();

    this.portal = portal;

    // Watch for user changes
    // const { watch } = await importEsri('esri/core/reactiveUtils');
    this.portal.addHandles(
      watch(
        () => this.portal?.user,
        () => (this.user = this.portal.user),
        { initial: true },
      ),
    );
  }

  async onSignInClick(): Promise<void> {
    // const esriId: __esri.IdentityManager = await importEsri('esri/identity/IdentityManager');
    await esriId.getCredential(this.portal.url);
    await this.connectPortal();
  }

  render() {
    return <div>
      <div>Hello World</div>
      {/* Display signin button if no Portal user property */}
      {!this.user ? (
          <calcite-button  onClick={() => this.onSignInClick()}>
            Sign In
          </calcite-button>
        ) : <div>signed in!</div>
      }
    </div>;
  }
}
