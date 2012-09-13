Mutually Exclusive Select Lists  - Jquery
=========================================

Usage:
-------------
Include the file jquery-1.8.1.min.js and mutually_exclusive_select_lists.min.js in the header of your html file:

```bash
<head>
	<script type="text/javascript" src="jquery-1.8.1.min.js"></script>
	<script type="text/javascript" src="mutually_exclusive_select_lists.min.js"></script>
</head>
```

In your script tag:

```bash
<script>
	$(document).ready(function () {
		$('select.mutually_exclusive_select_lists').onlyBeOne();
	})
</script>
```

Check out [Jsfiddle Demo](http://jsfiddle.net/ezKDB/)

Description: 
-------------
This plugin will take any group of selects list that have same entries and classname initially and will prevent any selected entries in the current list from appearing as an option in the other sibling lists. When the focused list entry is changed, the previous entry of the focused list will be make available to all of the sibling lists.

Notes: 
-------------
This will work with or without the value attribute on the select lists. I assume that you have a blank option in the beginning of each list and each entry is unique. Will assume that all lists start out with the same entries, but will not work if initially each list contain a list that is different from siblings. Will still work when the initial set entries count is greater than amount of select lists.