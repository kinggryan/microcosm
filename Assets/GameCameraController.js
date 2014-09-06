#pragma strict

// Game Camera Controller Class
//	This class defines a border at the edges of the screen and moves the camera around the point 0,0 when the mouse is at the
//		screen edge

var sideBorderSize = 200;
var topBorderSize = 200;

public var rotationSpeedDegreesPerSecond = 270;
public var maxHeight = 4;

function Update() {
	var mousePosition = Input.mousePosition;
	var hSpeed = 0;
	var vSpeed = 0;
	
	// scroll sideways
	if (mousePosition.x < sideBorderSize)
		hSpeed = rotationSpeedDegreesPerSecond * (1.0 - (mousePosition.x / sideBorderSize));
	else if (mousePosition.x > Screen.width - sideBorderSize) 
		hSpeed = -rotationSpeedDegreesPerSecond * (1.0 - ((Screen.width - mousePosition.x) / (sideBorderSize)));
		
	// scroll vertically
	if (mousePosition.y < topBorderSize)
		vSpeed = -rotationSpeedDegreesPerSecond * (1.0 - (mousePosition.y / topBorderSize));
	else if (mousePosition.y > Screen.height - topBorderSize) 
		vSpeed = rotationSpeedDegreesPerSecond * (1.0 - ((Screen.height - mousePosition.y) / (topBorderSize)));
	
	var hMovement = hSpeed * Time.deltaTime;
	var vMovement = vSpeed * Time.deltaTime;
	
	// rotate
	transform.RotateAround(Vector3.zero,Vector3.up,hMovement);
	
	// rotate vertically
	if ((vMovement > 0 && transform.position.y < maxHeight) || (vMovement < 0 && transform.position.y > -maxHeight))
		transform.RotateAround(Vector3.zero,transform.right,vMovement);
	
	// Look at center
	transform.LookAt(Vector3.zero);
}