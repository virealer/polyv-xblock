import os
from setuptools import setup


def package_data(pkg, root):
    """Generic function to find package_data for `pkg` under `root`."""
    data = []
    for dirname, _, files in os.walk(os.path.join(pkg, root)):
        for fname in files:
            data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='polyv-xblock',
    version='0.1',
    author="virealer",
    author_email="virealer@gmail.com",
    description='polyv',
    packages=[
        'polyv',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'polyv = polyv:polyvXBlock',
        ]
    },
    package_data=package_data("polyv", "static"),
)
