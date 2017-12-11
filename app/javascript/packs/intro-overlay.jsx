import React from 'react'
import {findDOMNode} from 'react-dom';
import sprintf from 'sprintf';
import _ from 'underscore';
import $ from 'jquery';

export class IntroOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        $(findDOMNode(this)).stop(true, true).fadeIn('slow');
      } else {
        $(findDOMNode(this)).stop(true, true).fadeOut('slow');
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(props) {
    return (<div className="framebar-overlay intro-overlay" style={this.props.style}>
      <div className="inside-1">
        <div className="text-center" style={{margin: '20px'}}>
          <p className=""><strong>Busca las mejores ofertas</strong> de supermercados online en tu zona y ahora el tiempo para selecionar los productos con reutilizar la lista!</p>
          <p className=""><strong>Elige</strong> el proveedor y <strong>entra las cosas</strong> como 'patatas', 'agua mineral' o 'platanos' en la lista y busca las ofertas de provedores!</p>
        </div>
      </div>
    </div>)
  }
}