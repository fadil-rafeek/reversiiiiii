import React from 'react';

class ImageStreamWithFrameSize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameSize: '12', // Default frame size value for VGA resolution
    };
  }

  handleFrameSizeChange = (newFrameSize) => {
    this.setState({ frameSize: newFrameSize });
    // Send request to update frame size
    fetch(`http://192.168.4.1/control?var=framesize&val=${newFrameSize}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update frame size');
        }
        // Optionally handle success response
      })
      .catch((error) => {
        console.error('Error updating frame size:', error);
      });
  };

  turnOnFlash = () => {
    // Send request to turn on flash
    fetch('http://192.168.4.1/control?var=led_intensity&val=155')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to turn on flash');
        }
        // Optionally handle success response
      })
      .catch((error) => {
        console.error('Error turning on flash:', error);
      });
  };

  turnOffFlash = () => {
    // Send request to turn off flash
    fetch('http://192.168.4.1/control?var=led_intensity&val=0')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to turn off flash');
        }
        // Optionally handle success response
      })
      .catch((error) => {
        console.error('Error turning off flash:', error);
      });
  };

  componentDidMount() {
    // Draw parking guide on hidden canvas
    this.drawParkingGuide();
  }

  drawParkingGuide = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Define canvas dimensions
    canvas.width = 640; // Example width
    canvas.height = 480; // Example height

    // Define left-hand parking lines
    const leftLines = [
      { start: { x: 0, y: canvas.height }, end: { x: 150, y: canvas.height * 0.500 } },

    ];

    // Draw left-hand lines
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 8;
    leftLines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
    });

    // Define right-hand parking lines
    const rightLines = leftLines.map(line => {
      return {
        start: { x: canvas.width - line.start.x, y: line.start.y },
        end: { x: canvas.width - line.end.x, y: line.end.y }
      };
    });

    // Draw right-hand lines
    rightLines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
    });

    // Convert canvas to data URL and set it in state
    this.setState({ parkingGuideURL: canvas.toDataURL() });
  };

  render() {
    const { frameSize, parkingGuideURL } = this.state;
    const imageURL = 'http://192.168.4.1:81/stream'; // Image stream URL

    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          maxWidth: '100vw',
          margin: 'auto',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#333', // Dark background color
          color: '#fff', // Light text color
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#444', // Dark sidebar background color
            borderRight: '1px solid #666', // Dark border color
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Functions</h1>
          <div>
            <button
              onClick={() => this.handleFrameSizeChange('8')}
              style={{
                marginBottom: '20px',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #666', // Dark border color
                fontSize: '16px',
                backgroundColor: frameSize === '8' ? '#28a745' : '#555', // Green background for selected, dark background for unselected
                color: '#fff', // Light text color
                cursor: 'pointer',
              }}
            >
              VGA (640x480)
            </button>
          </div>
          <div>
            <button
              onClick={this.turnOnFlash}
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#28a745', // Green color for "Turn On Flash" button
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Turn On Flash
            </button>
            <button
              onClick={this.turnOffFlash}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#dc3545', // Red color for "Turn Off Flash" button
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Turn Off Flash
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 4,
            padding: '20px',
            position: 'relative', // Add position relative for the container
          }}
        >
          {parkingGuideURL && (
            <img
              src={imageURL}
              alt="Stream"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', // Light box-shadow color
              }}
            />
          )}
          {parkingGuideURL && (
            <img
              src={parkingGuideURL}
              alt="Parking Guide"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: '2px',
                pointerEvents: 'none', // Disable pointer events for the parking guide
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ImageStreamWithFrameSize;
