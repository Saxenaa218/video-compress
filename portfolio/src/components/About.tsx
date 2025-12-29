"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skills = [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Next.js", level: 88 },
    { name: "Tailwind CSS", level: 92 },
    { name: "Python", level: 80 },
    { name: "PostgreSQL", level: 82 },
    { name: "Docker", level: 75 },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-white dark:bg-gray-800"
      aria-labelledby="about-title"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="about-title"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            About Me
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              A passionate developer building digital experiences
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              With over 5 years of experience in web development, I specialize
              in creating responsive, accessible, and performant web
              applications. My journey started with a curiosity about how
              websites work, and it has evolved into a deep passion for crafting
              exceptional user experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              I believe in writing clean, maintainable code and staying
              up-to-date with the latest technologies and best practices. When
              I&apos;m not coding, you can find me contributing to open-source
              projects, writing technical blog posts, or exploring new
              frameworks.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              I&apos;m committed to accessibility and inclusivity in web
              development, ensuring that the applications I build can be used by
              everyone, regardless of their abilities.
            </p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400 mr-2">
                  ▹
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Location:</strong> San Francisco, CA
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400 mr-2">
                  ▹
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> john@example.com
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400 mr-2">
                  ▹
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Education:</strong> CS Degree
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400 mr-2">
                  ▹
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Experience:</strong> 5+ Years
                </span>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Technical Skills
            </h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {skill.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {skill.level}%
                    </span>
                  </div>
                  <div
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
                    role="progressbar"
                    aria-valuenow={skill.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} proficiency: ${skill.level}%`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={
                        isInView
                          ? { width: `${skill.level}%` }
                          : { width: 0 }
                      }
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
