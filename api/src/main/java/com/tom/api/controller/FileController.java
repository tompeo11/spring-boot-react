package com.tom.api.controller;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/file")
public class FileController {
    @GetMapping(value = "/image/{filename}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<byte[]> getFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("upload", "images/products").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return new ResponseEntity<>(FileUtils.readFileToByteArray(resource.getFile()), HttpStatus.OK);
            }else {
                throw new RuntimeException("Couldn't not find the image");
            }
        }catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping(value = "/avatar/{fileName}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<byte[]> getAvatar(@PathVariable String fileName) {
        try {
            Path path = Path.of("upload/images/profile/" + fileName);
            Resource resource = new UrlResource(path.toUri());
            byte[] data = resource.getInputStream().readAllBytes();

            if (data.length == 0) {
                throw new RuntimeException("File not found");
            }

            return ResponseEntity.ok().body(data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
