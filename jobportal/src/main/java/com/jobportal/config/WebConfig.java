package com.jobportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = "uploads/resumes";
        String absolutePath = new File(uploadDir).getAbsolutePath();

        registry.addResourceHandler("/files/resumes/**")
                .addResourceLocations("file:" + absolutePath + File.separator);
    }
}