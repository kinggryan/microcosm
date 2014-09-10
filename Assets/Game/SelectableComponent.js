#pragma strict

// Selectable Component Interface
//	any object that has graphical changes when selected must implement this interface

class SelectableComponent extends Photon.MonoBehaviour {
	// methods
	function Select() {}
	function Deselect(inheritSelection: boolean) {}
}