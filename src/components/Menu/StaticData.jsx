import React, { useState } from 'react';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { directoryStructure } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';


const StaticData = () => {

    const navigate=useNavigate();
    const [selectedNode, setSelectedNode] = useState(null);

    const renderTreeItem=(node)=>
    {
        const isLeafNode = !node.children;

        const handleClick = () => {
            if (isLeafNode) {
                // Construct the full path by traversing up the tree
                let fullPath = node.id;
                // let parent = node.parent;

                // console.log(parent);

                // while (parent) {
                //     fullPath = `${parent.name}/${fullPath}`;
                //     parent = parent.parent;
                // }

                // Prepend the root node's name
                //   fullPath = `assets/${fullPath}`;

                // Navigate to the route and pass the full path as state
                navigate('/manage-assets', { state: { fullPath } });
            }

            setSelectedNode(node.id);
        };

        return (
            <TreeItem
            key={node.id}
            nodeId={node.id}
            onClick={handleClick}
            sx={{
                width: '100%',
                overflowY: 'auto',
                height: 'fit-content',
                padding: '0 2px',
                cursor: isLeafNode ? 'pointer' : 'default',
                borderRadius: '10px',
                overflowX: 'hidden',
                backgroundColor: selectedNode===node.id?'#f3e8ff !important':'transparent !important'
            }}
            label={
                <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>{node.name}</div>
              }
            >
            {node.children &&
                node.children.map((child) => renderTreeItem(child))}
            </TreeItem>
        );
    }   

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        height: 'auto',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {renderTreeItem(directoryStructure)}
    </TreeView>
  );
};

export default StaticData;
