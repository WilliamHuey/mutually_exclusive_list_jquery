Mutually Exclusive Select Lists
===============================

Usage:
-------------
Include the file jquery-1.7.2.js and mutually_exclusive_select_lists.js in the header of your html file:

<head>
	<script type="text/javascript" src="jquery-1.7.2.js"></script>
	<script type="text/javascript" src="mutually_exclusive.js"></script>
</head>


In your script tag:

<script>
	$('select.class_name_for_your_select_list').onlyBeOne();
</script>

Description: 
-------------
This plugin will take any group of selects list that have same entries and classname initially and will prevent any selected entries in the current list from appearing as an option in the other sibling lists. When the focused list entry is changed, the previous entry of the focused list will be make available to all of the sibling lists.

Notes: 
-------------
This will work with or without the value attribute on the select lists. I assume that you have a blank option in the beginning of each list and each entry is unique. Assume also that all lists start out with the same entries. Will still work when there are more entries than there are select lists.