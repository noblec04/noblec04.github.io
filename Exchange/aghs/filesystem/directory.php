<?php
    // file_array() by Jamon Holmgren. Exclude files by putting them in the $exclude
    // string separated by pipes. Returns an array with filenames as strings.
    function file_array($path, $exclude = ".|..", $recursive = false) {
        $path = rtrim($path, "/") . "/";
        $folder_handle = opendir($path);
        $exclude_array = explode("|", $exclude);
        $result = array();
        while(false !== ($filename = readdir($folder_handle))) {
            if(!in_array(strtolower($filename), $exclude_array)) {
                if(is_dir($path . $filename . "/")) {
                    if($recursive) $result[] = file_array($path, $exclude, true);
                } else {
                    $result[] = $filename;
                }
            }
        }
        return $result;
    }

?>